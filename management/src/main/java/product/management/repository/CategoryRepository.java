package product.management.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import product.management.entity.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
}
