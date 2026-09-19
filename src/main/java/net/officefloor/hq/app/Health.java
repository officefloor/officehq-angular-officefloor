package net.officefloor.hq.app;

/**
 * Readiness probe wired at GET /health (officefloor/rest/health.GET.yml) — the harness polls this
 * (config.yaml -> app.health_url). A WoOF procedure whose returned object is sent as the response;
 * TODO: confirm the exact OfficeFloor response mechanism (return value serialised to JSON, or
 * inject ServerHttpConnection and write). Keep it dependency-free so it answers before the DB warms.
 */
public class Health {

    public record Status(String status) {}

    public Status check() {
        return new Status("UP");
    }
}
