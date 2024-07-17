package product.management.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import product.management.model.CategoryModel;
import product.management.service.CategoryService;

@RestController
@RequestMapping("/api/categories")

public class CategoryController{
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryModel>> fetchCategories(){
        List<CategoryModel> allCategories = categoryService.findAll();
        return ResponseEntity.ok(allCategories);
    }

    @PostMapping("/add")
    public ResponseEntity<CategoryModel> addCategory(@RequestBody CategoryModel categoryModel){
        CategoryModel savedCategory = categoryService.save(categoryModel);
        return ResponseEntity.ok(savedCategory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryModel> getCategory(@PathVariable Long id){
        CategoryModel editCategory = categoryService.convertToModel(categoryService.findCategoryById(id));
        return ResponseEntity.ok(editCategory);
    }

    @PostMapping("/edit")
    public ResponseEntity<CategoryModel> editCategory(@RequestBody CategoryModel categoryModel){
        CategoryModel savedCategory = categoryService.edit(categoryModel);
        return ResponseEntity.ok(savedCategory);
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }



}