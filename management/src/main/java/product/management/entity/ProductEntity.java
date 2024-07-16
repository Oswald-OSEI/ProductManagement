package product.management.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String productName;
    private double price;
    private String description;
    private int stock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category")
    private CategoryEntity category;

    //constructors
    public ProductEntity(){}

    public ProductEntity(CategoryEntity category, String productName, double price, String description, int stock){
        this.category = category;
        this.productName = productName;
        this.price = price;
        this.description=description;
        this.stock = stock;
    }

    public ProductEntity(Long id, CategoryEntity category, String productName, double price, String description, int stock){
        this.id = id;
        this.category = category;
        this.productName = productName;
        this.price = price;
        this.description=description;
        this.stock = stock;
    }

    //Setters
    public void setCategory(CategoryEntity category){
        this.category=category;
    }

    public void setName(String name){
        this.productName=name;
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
    public CategoryEntity getCategory(){
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