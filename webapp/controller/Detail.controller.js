sap.ui.define([
  "bs/ui5/projeto/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "bs/ui5/projeto/model/formatter"
], function (BaseController, History, Fragment, MessageToast, MessageBox, Filter, FilterOperator, formatter) {
  "use strict";

  return BaseController.extend("bs.ui5.projeto.controller.Detail", {

    formatter: formatter,

    onInit: function () {
      this.getRouter().getRoute("detail").attachPatternMatched(this._onMatched, this);
    },

    _onMatched: function (oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      this._sDiscPath = "/Disciplinas/" + oArgs.discIndex;
      this.getView().bindElement({ path: this._sDiscPath });
      
      var oTable = this.byId("resourcesTable");
      if (oTable) {
        var oBinding = oTable.getBinding("items");
        if (oBinding) {
          oBinding.filter([]);
        }
      }
    },

    onNavBack: function () {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("home", {}, true);
      }
    },

    onSearchResources: function (oEvent) {
      var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue") || "";
      var oTable = this.byId("resourcesTable");
      var oBinding = oTable && oTable.getBinding("items");
      
      if (!oBinding) return;

      var aFilters = [];
      
      if (sQuery && sQuery.trim()) {
        aFilters.push(
          new Filter({
            filters: [
              new Filter("titulo", FilterOperator.Contains, sQuery),
              new Filter("tipo", FilterOperator.Contains, sQuery),
              new Filter("descricao", FilterOperator.Contains, sQuery)
            ],
            and: false
          })
        );
      }

      oBinding.filter(aFilters);
    },

    onClearSearch: function () {
      var oSearchField = this.byId("resourceSearchField");
      if (oSearchField) {
        oSearchField.setValue("");
        this.onSearchResources({ getParameter: function() { return ""; } });
      }
    },

    onAddResource: function () {
      var oView = this.getView();
      var that = this;

      if (!this._oAddResourceDialog) {
        Fragment.load({
          id: oView.getId(),
          name: "bs.ui5.projeto.view.fragment.AddResourceDialog",
          controller: this
        }).then(function (oDialog) {
          that._oAddResourceDialog = oDialog;
          oView.addDependent(oDialog);
          oDialog.open();
        }).catch(function (err) {
          MessageBox.error("Falha ao carregar o diálogo de recurso.\n\n" + err);
        });
      } else {
        this._oAddResourceDialog.open();
      }
    },

    onAddResourceCancel: function () {
      if (this._oAddResourceDialog) {
        this._oAddResourceDialog.close();
      }
    },

    onAddResourceSave: function () {
      if (!this._sDiscPath) {
        MessageBox.error("Disciplina não encontrada.");
        return;
      }
  
      var oModel = this.getView().getModel();
      
      var oTitleInput = this.byId("newResTitle");
      var oUrlInput = this.byId("newResUrl");
      var oTypeSelect = this.byId("newResType");
      var oDescArea = this.byId("newResDescription");
      var oMandatoryCB = this.byId("newResMandatory");
  
      oTitleInput.setValueState("None");
      oUrlInput.setValueState("None");
      oDescArea.setValueState("None");

      var bError = false;
      
      if (!oTitleInput.getValue().trim()) {
        oTitleInput.setValueState("Error");
        oTitleInput.setValueStateText("Título é obrigatório");
        bError = true;
      }
      
      var sUrl = oUrlInput.getValue().trim();
      if (!sUrl) {
        oUrlInput.setValueState("Warning");
        oUrlInput.setValueStateText("Recomenda-se fornecer uma URL");
      }

      if (bError) {
        MessageBox.warning("Preencha os campos obrigatórios.");
        return;
      }
  
      var oNewRes = {
        titulo: oTitleInput.getValue().trim(),
        tipo: oTypeSelect.getSelectedKey() || "Outro",
        descricao: oDescArea.getValue().trim() || "Sem descrição disponível",
        obrigatorio: oMandatoryCB.getSelected(), 
        url: sUrl || ""
      };
  
      var sRecursosPath = this._sDiscPath + "/recursos";
      var aRecursos = oModel.getProperty(sRecursosPath) || [];
      var aNewRecursos = [...aRecursos, oNewRes]; 
      oModel.setProperty(sRecursosPath, aNewRecursos);
  
      MessageToast.show("Recurso adicionado com sucesso!");
  
      oTitleInput.setValue("").setValueState("None");
      oUrlInput.setValue("").setValueState("None");
      oTypeSelect.setSelectedKey("Livro"); 
      oDescArea.setValue("").setValueState("None");
      oMandatoryCB.setSelected(false);
  
      if (this._oAddResourceDialog) {
        this._oAddResourceDialog.close();
      }
    }

  });
});
