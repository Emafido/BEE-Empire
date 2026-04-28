package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// --- MOCK SEED DATA ---
func SeedDatabase() {
	var count int64
	DB.Model(&Product{}).Count(&count)

	if count == 0 {
		log.Println("Seeding database with updated variants...")
		products := []Product{
			{Name: "Velvet Trench Coat", Price: 85000, Category: "Outerwear", ImageUrl: "/mock-5.jpg", IsNew: false, Colors: "Black,Brown,Nude", Sizes: "S,M,L"},
			{Name: "Ribbed Knit Two-Piece", Price: 32000, Category: "Sets", ImageUrl: "/mock-2.jpg", IsNew: false, Colors: "Sky Blue,Pink,Grey", Sizes: "S,M,L,XL"},
			{Name: "Signature Mini Tote", Price: 14500, Category: "Bags", ImageUrl: "/mock-1.jpg", IsNew: true, Colors: "Black,White,Nude,Brown", Sizes: "Standard"},
		}
		DB.Create(&products)

		// Create a default admin user for testing
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

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// --- PROTECTED ADMIN ROUTES ---
func CreateProduct(c *gin.Context) {
	var newProduct Product
	if err := c.ShouldBindJSON(&newProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB.Create(&newProduct)
	c.JSON(http.StatusCreated, newProduct)
}

func main() {
	ConnectDatabase()
	SeedDatabase()

	r := gin.Default()

	// CORS Config
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public Routes
	r.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "API is LIVE"}) })
	r.GET("/products", GetProducts)
	r.POST("/login", Login)

	// Protected Admin Group
	admin := r.Group("/admin")
	admin.Use(AuthRequired()) // Apply the middleware here
	{
		admin.POST("/products", CreateProduct)
	}

	r.Run(":8080")
}