package net.officefloor.hq.app;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring configuration SUPPLIED into OfficeFloor (referenced by
 * officefloor/suppliers/Spring.yml -> configuration.class). Its @Bean methods and any
 * {@code @RestController} / {@code @Service} become OfficeFloor dependencies. There is NO main()
 * here — the executable jar's main class is net.officefloor.OfficeFloorMain (see pom.xml).
 *
 * At the base this is empty; checkpoints add @Bean services / controllers as features are built.
 */
@SpringBootApplication
public class Application {
    // TODO: @Bean service definitions added per checkpoint. Keep additive.
}
