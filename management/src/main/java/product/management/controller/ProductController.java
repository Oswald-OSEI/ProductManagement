package product.management.controller;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;


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
    public ResponseEntity<Page<ProductModel>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Page<ProductModel> productPage = productService.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel>getProductById(@PathVariable Long id){
        ProductModel product = productService.findById(id);
        return ResponseEntity.ok(product);}

    @PostMapping("/add")
    public ResponseEntity<ProductModel> createProduct(@RequestBody ProductModel productModel){
        System.out.println("the category ID is    "+productModel.getCategory().getCategoryId());
        ProductModel savedProduct = productService.save(productModel);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/edit")
    public ResponseEntity<ProductModel> editProduct(@RequestBody ProductModel productModel){
        ProductModel savedProduct = productService.edit(productModel);
        return ResponseEntity.ok(savedProduct);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }



}