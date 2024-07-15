package product.management.service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import product.management.entity.CategoryEntity;
import product.management.entity.ProductEntity;
import product.management.model.CategoryModel;
import product.management.model.ProductModel;
import product.management.repository.ProductRepository;
import product.management.repository.CategoryRepository;

 
@Service
public class ProductService {
    
    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    
    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public List<ProductModel> findAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable)
        .getContent()
        .stream()
        .map(this::convertToProductModel)
        .collect(Collectors.toList());
    }

    @Transactional
    public ProductModel save(ProductModel productModel){
        ProductEntity productEntity = convertToProductEntity(productModel);
        CategoryEntity savedCategory;
        ProductEntity savedProduct;
        // Ensure the category exists and is persisted
        if (productEntity.getCategory() != null && productEntity.getCategory().getCategoryId() != null) {
            Optional<CategoryEntity> optionalCategory = categoryRepository.findById(productEntity.getCategory().getCategoryId());
            if (optionalCategory.isPresent()) {
                savedCategory = optionalCategory.get();
}               savedProduct = productRepository.save(productEntity);
                }
             return convertToProductModel(savedProduct);}
            
        
    
    public void deleteById(Long id){
        productRepository.deleteById(id);
    }

    public ProductModel findById(Long id){
        Optional<ProductEntity> productEntity = productRepository.findById(id);
        return productEntity.map(this::convertToProductModel).orElseThrow(()-> new RuntimeException("Product not found"));
    }

    private ProductEntity convertToProductEntity(ProductModel productModel) {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setName(productModel.getName());
        productEntity.setDescription(productModel.getDescription());
        productEntity.setPrice(productModel.getPrice());
        productEntity.setStock(productModel.getStock());
        
        if (productModel.getCategory() != null && productModel.getCategory().getCategoryId() != null) {
            CategoryEntity category = new CategoryEntity();
            category.setCategoryId(productModel.getCategory().getCategoryId());
            productEntity.setCategory(category);
        }
        
        return productEntity;
    }

    public ProductModel convertToProductModel(ProductEntity productEntity){
        ProductModel productModel = new ProductModel();
        productModel.setName(productEntity.getName());
        productModel.setDescription(productEntity.getDescription());
        productModel.setPrice(productEntity.getPrice());
        productModel.setStock(productEntity.getStock());
        
        if (productEntity.getCategory() != null) {
            CategoryModel categoryModel = new CategoryModel();
            categoryModel.setCategoryId(productEntity.getCategory().getCategoryId());
            categoryModel.setCategoryName(productEntity.getCategory().getCategoryName());
            productModel.setCategory(categoryModel);
        }
        
        return productModel;
    }
}
