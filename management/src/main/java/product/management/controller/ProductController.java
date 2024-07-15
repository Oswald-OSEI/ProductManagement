package product.management.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import product.management.model.ProductModel;
import product.management.service.ProductService;

@RestController
@RequestMapping("/api/products")

public class ProductController {
    private final ProductService productService;

    //public ProductController(){}
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductModel>> getAllProducts(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "10") int size
    ){List<ProductModel> AllProducts = productService.findAll(page, size);
        return ResponseEntity.ok(AllProducts);

    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel>getProductById(@PathVariable Long id){
        ProductModel product = productService.findById(id);
        return ResponseEntity.ok(product);}

    @PostMapping("/add")
    public ResponseEntity<ProductModel> createProduct(@RequestBody ProductModel productModel){
        ProductModel savedProduct = productService.save(productModel);
        return ResponseEntity.ok(savedProduct);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    

    
}
