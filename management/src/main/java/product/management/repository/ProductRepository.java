package product.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import product.management.entity.ProductEntity;
public interface ProductRepository extends JpaRepository<ProductEntity, Long>{
    Page<ProductEntity> findByName(String productName, Pageable pageable);
}
