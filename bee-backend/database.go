package main

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is not set!")
	}

	// Peace treaty between GORM and Supabase Connection Pooler
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, 
	}), &gorm.Config{
		PrepareStmt: false, 
	})

	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL:", err)
	}

	log.Println("🔥 Connected to Production PostgreSQL!")

	err = db.AutoMigrate(&Product{}, &AdminUser{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = db
}