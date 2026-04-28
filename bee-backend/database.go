package main

import (
	"log"

	"github.com/glebarez/sqlite" // <--- The Pure Go driver
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Connect to local SQLite file
	db, err := gorm.Open(sqlite.Open("shop.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established. No CGO required!")

	// Auto-Migrate our Product schema
	err = db.AutoMigrate(&Product{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = db
}