package product.management.entity;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class CategoryEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String categoryName;
    @OneToMany(mappedBy = "category")
    private List<ProductEntity> products;

    //Constructors
    public CategoryEntity(){}

    public CategoryEntity(String categoryName){
        this.categoryName = categoryName;
    }

    public CategoryEntity(Long id, String categoryName){
        this.id = id;
        this.categoryName = categoryName;
    }


    //setters
    public void setCategoryName(String categoryName){
        this.categoryName = categoryName;
    }

    public void setProducts(List<ProductEntity> product){
        this.products = product;
    }

    public void setCategoryId(Long id){
        this.id = id;
    }

    //Getters
    public String getCategoryName(){
        return this.categoryName;
    }

    public List<ProductEntity> getProducts(){
        return this.products;
    }

    public Long getCategoryId(){
        return this.id;
    }

}