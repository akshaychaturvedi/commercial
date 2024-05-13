using {
    Product,
    Metric,
    ProductMetrices
} from '../db/data-model';

service ProductService {
    entity ProductList         as projection on Product;
    entity MetricsList         as projection on Metric;
    entity ProductMetricesList as projection on ProductMetrices;
}
