$(document).ready(function () {
    $('#content_list_partisant_js_jheo').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
        }
    });
    document.querySelector("#content_list_partisant_js_jheo_filter > label > input[type=search]").setAttribute("placeholder", "Recherche");
});
