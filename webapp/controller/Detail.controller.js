sap.ui.define([
  "bs/ui5/projeto/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (BaseController, History, Fragment, MessageToast, MessageBox) {
  "use strict";

  return BaseController.extend("bs.ui5.projeto.controller.Detail", {

    onInit: function () {
      this.getRouter().getRoute("detail").attachPatternMatched(this._onMatched, this);
    },

    _onMatched: function (oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      this._sDiscPath = "/Disciplinas/" + oArgs.discIndex;
      this.getView().bindElement({ path: this._sDiscPath });
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
      
      // 1. Capturar referências dos inputs para validação visual
      var oTitleInput = this.byId("newResTitle");
      var oUrlInput = this.byId("newResUrl");
      var oTypeSelect = this.byId("newResType");
      var oDescArea = this.byId("newResDescription");
      var oMandatoryCB = this.byId("newResMandatory");
  
      // 2. Validações "em branco"
      var bError = false;
      if (!oTitleInput.getValue().trim()) {
          oTitleInput.setValueState("Error");
          bError = true;
      }
      if (!oUrlInput.getValue().trim()) {
          oUrlInput.setValueState("Error");
          bError = true;
      }
  
      if (bError) {
          MessageBox.warning("Preencha os campos obrigatórios.");
          return;
      }
  
      // 3. Criar o objeto do novo recurso
      var oNewRes = {
          titulo: oTitleInput.getValue(),
          tipo: oTypeSelect.getSelectedKey(),
          descricao: oDescArea.getValue(),
          obrigatorio: oMandatoryCB.getSelected(), 
          url: oUrlInput.getValue()
      };
  
      // 4. Atualizar o Modelo (JSON)
      var sRecursosPath = this._sDiscPath + "/recursos";
      var aRecursos = oModel.getProperty(sRecursosPath) || [];
      var aNewRecursos = [...aRecursos, oNewRes]; 
      oModel.setProperty(sRecursosPath, aNewRecursos);
  
      MessageToast.show("Recurso adicionado com sucesso!");
  
      // 5. RESET DOS CAMPOS (Cuidado com os nomes dos métodos aqui!)
      oTitleInput.setValue("").setValueState("None");
      oUrlInput.setValue("").setValueState("None");
      oTypeSelect.setSelectedKey("Livro"); 
      oDescArea.setValue("");
      oMandatoryCB.setSelected(false); // <--- CORRIGIDO (era aqui que crashava)
  
      // 6. FECHAR O DIALOG
      if (this._oAddResourceDialog) {
          this._oAddResourceDialog.close();
      }
  }

  });
});