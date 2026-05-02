package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func GetProducts(c *gin.Context) {
	var products []Product
	DB.Order("created_at desc").Find(&products)
	c.JSON(http.StatusOK, products)
}

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

func CreateProduct(c *gin.Context) {
	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	category := c.PostForm("category")
	colors := c.PostForm("colors")
	sizes := c.PostForm("sizes")
	stockStr := c.PostForm("stock")
	isNewStr := c.PostForm("isNew")

	price, _ := strconv.ParseFloat(priceStr, 64)
	stock, _ := strconv.Atoi(stockStr)
	isNew := isNewStr == "true"

	file, err := c.FormFile("image")
	var imageUrl string

	if err == nil {
		fileContent, _ := file.Open()
		defer fileContent.Close()

		cld, _ := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
		ctx := context.Background()
		uploadResult, uploadErr := cld.Upload.Upload(ctx, fileContent, uploader.UploadParams{
			Folder: "bee_empire_drops",
		})

		if uploadErr == nil {
			imageUrl = uploadResult.SecureURL
		} else {
			log.Println("❌ CLOUDINARY UPLOAD ERROR:", uploadErr)
		}
	}

	newProduct := Product{
		Name:     name,
		Price:    price,
		Category: category,
		ImageUrl: imageUrl,
		Colors:   colors,
		Sizes:    sizes,
		Stock:    stock,
		IsNew:    isNew,
	}

	DB.Create(&newProduct)
	c.JSON(http.StatusCreated, newProduct)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := DB.Delete(&Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func ToggleIsNew(c *gin.Context) {
	id := c.Param("id")
	var product Product
	
	if err := DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	product.IsNew = !product.IsNew
	DB.Save(&product)
	
	c.JSON(http.StatusOK, product)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found. This is normal in production.")
	}

	ConnectDatabase()

	// In production, we want gin to run in release mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// CORS Configuration to allow Render and Vercel domains later
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
	}))

	// Public Routes
	r.GET("/products", GetProducts)
	r.POST("/login", Login)

	// Protected Admin Routes
	admin := r.Group("/admin")
	admin.Use(AuthRequired())
	{
		admin.POST("/products", CreateProduct)
		admin.DELETE("/products/:id", DeleteProduct)
		admin.PATCH("/products/:id/toggle-new", ToggleIsNew)
	}

	// Dynamic Port Binding (Crucial for Render)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Fallback for local development
	}
	
	log.Printf("🚀 Server starting on port %s", port)
	r.Run(":" + port)
}