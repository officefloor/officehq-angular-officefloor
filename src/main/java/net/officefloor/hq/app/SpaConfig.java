package net.officefloor.hq.app;

// SKELETON. TODO: serve the SPA from static resources with a deep-link fallback so a refresh on a
// client route returns index.html, while leaving API paths to OfficeFloor (BASE_CHECKLIST.md §B).
//
// @Configuration
// public class SpaConfig implements WebMvcConfigurer {
//   @Override public void addResourceHandlers(ResourceHandlerRegistry reg) {
//     reg.addResourceHandler("/**")
//        .addResourceLocations("classpath:/static/")
//        .resourceChain(true)
//        .addResolver(new PathResourceResolver() {
//          @Override protected Resource getResource(String path, Resource loc) throws IOException {
//            if (path.startsWith("api/")) return null;          // let OfficeFloor handle/404 the API
//            Resource r = loc.createRelative(path);
//            return (r.exists() && r.isReadable()) ? r : loc.createRelative("index.html");
//          }
//        });
//   }
// }
//
// NOTE: if OfficeFloor (not Spring MVC) owns request routing, apply the equivalent
// static-serve-with-index-fallback in its routing instead — the concept is the same.

final class SpaConfig {
    private SpaConfig() {}
}
