sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, ODataModel) {
    "use strict";

    return Controller.extend("commercialui.controller.App", {
      onInit: function () {
        // Read the master data for metrics
        jQuery.ajax({
          method: "GET",
          url: "/odata/v4/product/MetricsList",
          success: function (data) {
            var aMetricsData = data.value.map((val) => {
              return {
                name: val.name,
                isChecked: false,
                product_ID: "6b8e69e7-cdbb-4b86-b14b-310780daae7c"
              };
            });

            // Create metrics model
            var oMetricsModel = new sap.ui.model.json.JSONModel({
              metrics: aMetricsData,
            });
            this.getView().setModel(oMetricsModel, "MetricsModel");
          }.bind(this),
          error: function (error) {
            console.log(error);
          },
        });

        // Create product model
        var aProductData = {
          productName: "",
          productOwner: "",
        };
        var oProductModel = new sap.ui.model.json.JSONModel(aProductData);
        this.getView().setModel(oProductModel, "ProductModel");
      },
      onSave: function () {
        var aProductInitialData = {
            productName: "",
            productOwner: "",
          };
        var oProductModel = this.getView().getModel("ProductModel");
        var aProductData = oProductModel.getData();
        var oMetricsModel = this.getView().getModel("MetricsModel");
        var aMetricsData = oMetricsModel.getData();

        var oData = {
          productName: aProductData.productName,
          productOwner: aProductData.productOwner,
          metrices: aMetricsData.metrics,
        };

        console.log(aMetricsData);

        jQuery.ajax({
          url: "/odata/v4/product/ProductList",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(oData),
          success: function (response) {
            console.log("Successfully created Product:", response);
            oProductModel.setData(aProductInitialData)
            // Reset the flag 
            aMetricsData.metrics.forEach( (data) => {
              data.isChecked = false 
            })
            oMetricsModel.refresh(true)
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error creating Product:", errorThrown);
            // Handle error
          },
        });
      },
    });
  }
);
