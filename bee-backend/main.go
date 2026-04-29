package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// --- MOCK SEED DATA ---
func SeedDatabase() {
	// 1. Check and Seed Products
	var productCount int64
	DB.Model(&Product{}).Count(&productCount)

	if productCount == 0 {
		log.Println("Seeding database with updated variants...")
		products := []Product{
			{Name: "Velvet Trench Coat", Price: 85000, Category: "Outerwear", ImageUrl: "/mock-5.jpg", IsNew: false, Colors: "Black,Brown,Nude", Sizes: "S,M,L"},
			{Name: "Ribbed Knit Two-Piece", Price: 32000, Category: "Sets", ImageUrl: "/mock-2.jpg", IsNew: false, Colors: "Sky Blue,Pink,Grey", Sizes: "S,M,L,XL"},
			{Name: "Signature Mini Tote", Price: 14500, Category: "Bags", ImageUrl: "/mock-1.jpg", IsNew: true, Colors: "Black,White,Nude,Brown", Sizes: "Standard"},
		}
		DB.Create(&products)
	}

	// 2. INDEPENDENTLY Check and Seed Admin
	var adminCount int64
	DB.Model(&AdminUser{}).Count(&adminCount)

	if adminCount == 0 {
		log.Println("Creating default admin account...")
		DB.Create(&AdminUser{Username: "admin", Password: "password123"})
	}
}

// --- PUBLIC ROUTES ---
func GetProducts(c *gin.Context) {
	var products []Product
	DB.Find(&products)
	c.JSON(http.StatusOK, products)
}

// --- AUTH ROUTE ---
func Login(c *gin.Context) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var user AdminUser
	DB.Where("username = ? AND password = ?", credentials.Username, credentials.Password).First(&user)

	if user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT Token valid for 24 hours
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret) // jwtSecret is pulled from middleware.go
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// --- PROTECTED ADMIN ROUTES ---
func CreateProduct(c *gin.Context) {
	// 1. Parse the text fields from the Multipart Form
	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	category := c.PostForm("category")
	colors := c.PostForm("colors")
	sizes := c.PostForm("sizes")
	isNewStr := c.PostForm("isNew")

	price, _ := strconv.ParseFloat(priceStr, 64)
	isNew := isNewStr == "true"

	// 2. Handle the Image Upload
	file, err := c.FormFile("image")
	var imageUrl string

	if err == nil {
		// CRITICAL FIX: Replace spaces in the filename with dashes
		cleanFilename := strings.ReplaceAll(file.Filename, " ", "-")
		
		// Generate a unique filename using a timestamp so files don't overwrite each other
		filename := fmt.Sprintf("%d-%s", time.Now().Unix(), cleanFilename)
		filepath := filepath.Join("uploads", filename)

		// Save the physical file to our server
		if err := c.SaveUploadedFile(file, filepath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		
		// The safe URL the frontend will use to display it
		imageUrl = "http://localhost:8080/uploads/" + filename
	} else {
		// Fallback if no image is uploaded
		imageUrl = "/mock-1.jpg" 
	}

	// 3. Save to Database
	newProduct := Product{
		Name:     name,
		Price:    price,
		Category: category,
		ImageUrl: imageUrl,
		Colors:   colors,
		Sizes:    sizes,
		IsNew:    isNew,
	}

	DB.Create(&newProduct)
	c.JSON(http.StatusCreated, newProduct)
}

func main() {
	ConnectDatabase() // Pulled from database.go
	SeedDatabase()

	// Ensure the uploads directory exists on startup
	os.MkdirAll("uploads", os.ModePerm)

	r := gin.Default()

	// CORS Config
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Serve the /uploads folder directly to the web
	r.Static("/uploads", "./uploads")

	// Public Routes
	r.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "API is LIVE"}) })
	r.GET("/products", GetProducts)
	r.POST("/login", Login)

	// Protected Admin Group
	admin := r.Group("/admin")
	admin.Use(AuthRequired()) // Apply the middleware from middleware.go
	{
		admin.POST("/products", CreateProduct)
	}

	r.Run(":8080")
}