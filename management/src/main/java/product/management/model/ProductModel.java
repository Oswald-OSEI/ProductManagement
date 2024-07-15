package product.management.model;

public class ProductModel {
    private Long id;
    private String productName;
    private double price;
    private String description;
    private int stock;
    private CategoryModel category;

    //constructor
    public ProductModel(){}
    public ProductModel(CategoryModel category, String productName, double price, String description, int stock){
        this.category = category;
        this.productName = productName;
        this.price = price;
        this.description=description;
        this.stock = stock;
    } 

    public ProductModel(Long id, CategoryModel category, String productName, double price, String description, int stock){
        this.id = id;
        this.category = category;
        this.productName = productName;
        this.price = price;
        this.description=description;
        this.stock = stock;
    }

    //Setters 
    public void setCategory(CategoryModel category){
        this.category = category;
    }

    public void setName(String name){
        this.productName=name;       
    }

    public void setId(Long id){
        this.id = id;
    }


    public void setPrice(double price){
        this.price = price;
    }
    
    public void setDescription(String description){
        this.description = description;
    }

    public void setStock(int stock){
        this.stock = stock;
    }

    //Getters
    public CategoryModel getCategory(){
        return this.category;
    }

    public String getName(){
        return this.productName;
    }

    public double getPrice(){
        return this.price;
    }

    public String getDescription(){
        return this.description;
    }

    public int getStock(){
        return this.stock;
    }

    public Long getId(){
        return this.id;
    }
}
