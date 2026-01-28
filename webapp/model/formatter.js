sap.ui.define([], function () {
  "use strict";

  return {
    iconByType: function (sTipo) {
      switch ((sTipo || "").toLowerCase()) {
        case "livro": return "sap-icon://course-book";
        case "vídeo":
        case "video": return "sap-icon://video";
        case "artigo": return "sap-icon://document-text";
        default: return "sap-icon://document";
      }
    },

    stateByObrigatorio: function (bObrig) {
      return bObrig ? "Success" : "Error";
    },

    textObrigatorio: function (bObrig) {
      return bObrig ? "Consulta Obrigatória" : "Consulta Facultativa";
    }
  };
});