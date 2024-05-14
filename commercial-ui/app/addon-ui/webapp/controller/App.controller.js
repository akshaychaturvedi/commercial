sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter, MessageToast) {
    "use strict";

    return Controller.extend("addonui.controller.App", {
      onInit: function () {},

      filterTable: async function (oTable, sProductKey) {
        var oBinding = oTable.getBinding("items");
        var oFilters = [
          new sap.ui.model.Filter(
            "product_ID",
            sap.ui.model.FilterOperator.EQ,
            sProductKey
          ),
          new sap.ui.model.Filter(
            "isChecked",
            sap.ui.model.FilterOperator.EQ,
            true
          ),
        ];

        return new Promise(function (resolve, reject) {
          // Perform filtering
          oBinding.filter(oFilters,'Application');

          // Resolve the Promise after the filtering is complete
          oBinding.attachEventOnce("dataReceived", function () {
            resolve();
          });
        });
      },

      onSelection: async function () {
        var oProductBox = this.getView().byId("productBox");
        var oSelectedProduct = oProductBox.getSelectedItem();
        if (oSelectedProduct) {
          var sProductKey = oSelectedProduct.getKey();
        } else {
          MessageToast.show("Select Product");
          return;
        }

        var oLanguageBox = this.getView().byId("languageBox");
        var oSelectedLanguage = oLanguageBox.getSelectedItem();
        if (oSelectedLanguage) {
          var sLanguageKey = oSelectedLanguage.getText();
        } else {
          MessageToast.show("Select Language");
          return;
        }

        if (sProductKey) {
          var oBusyDialog = new sap.m.BusyDialog();
          oBusyDialog.open();

          var oTable = this.getView().byId("metricTable");
          await this.filterTable(oTable, sProductKey);
          oTable.setVisible(true);

          var oCodeArea = this.getView().byId('codeArea');
          oCodeArea.setVisible(true);
          
          oBusyDialog.close();
        }
      }
    });
  }
);
