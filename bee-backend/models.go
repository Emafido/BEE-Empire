package main

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	ImageUrl    string  `json:"imageUrl"` // We will keep one main image for now, and expand to an array later if needed
	IsNew       bool    `json:"isNew" gorm:"default:false"`
	
	// NEW: Storing variants as comma-separated strings (e.g., "Black,Pink,Blue")
	Colors      string  `json:"colors"` 
	Sizes       string  `json:"sizes"`  
}

// AdminUser represents the boutique owner's login credentials
type AdminUser struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"` // In production, this MUST be hashed!
}