using {cuid} from '@sap/cds/common';

// Master Data
entity Metric : cuid {
    name : String;
}

// Trasaction Data
// Header
entity Product : cuid {
    productName  : String;
    productOwner : String;
    metrices     : Composition of many ProductMetrices
                       on metrices.product = $self                       
}

//Item
entity ProductMetrices : cuid {
    name      : String;
    isChecked : Boolean;
    product   : Association to Product
}
