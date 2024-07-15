package product.management.model;
import java.util.List;

public class CategoryModel {
 private Long id;
 private String CategoryName;   
 private List<ProductModel> products;

//Constructor
public CategoryModel(){}
public CategoryModel(String CategoryName){
    this.CategoryName = CategoryName;
 }

 public CategoryModel(Long id, String CategoryName){
   this.id = id;
   this.CategoryName = CategoryName;
}

 //setters
 public void setCategoryName(String CategoryName){
    this.CategoryName = CategoryName;
 }

 public void setCategoryId(Long id){
   this.id = id;
 }

 public void setProducts(List<ProductModel> product){
    this.products = product;
 }

//Getters
public Long getCategoryId(){
   return this.id;
}
 public String getCategoryName(){
    return this.CategoryName;
 }

 public List<ProductModel> getProducts(){
    return this.products;
 }

}


