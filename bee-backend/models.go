package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

// Single source of truth for JWT Secret
var jwtSecret = []byte("super_secret_key_change_in_production")

type Product struct {
	gorm.Model
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Category string  `json:"category"`
	ImageUrl string  `json:"imageUrl"`
	IsNew    bool    `json:"isNew" gorm:"default:false"`
	Colors   string  `json:"colors"`
	Sizes    string  `json:"sizes"`
	Stock    int     `json:"stock"`
}

type AdminUser struct {
	gorm.Model
	Username string `json:"username"`
	Password string `json:"password"`
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}
		c.Next()
	}
}