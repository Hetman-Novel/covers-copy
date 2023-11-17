$(document).ready(function() {
    let articleCurrPage = 1;
    const loadMoreButtonElement = $("#editorial-archive-lastpage");

    loadMoreButtonElement.click(function () {

        const lastItem = document.querySelectorAll("#lastItem"); //collection name and Id of the last item in the writers articles list
        let lastItemValue = "";
        if (lastItem != 'undefined' && lastItem.length >= 1) {
            lastItemValue = lastItem[lastItem.length - 1].innerText;
        }

        articleCurrPage++;
        const url = '/LoadMoreArticlesWriters/549/20/' + articleCurrPage + '/' + lastItemValue;
        const headerElement = $(".covers-CoversWritersPage-moreBtn");
        const articleBlockElement = $("#editorial-archive-pages");
        CMG_ArticleBar_LoadMoreArticles(url, loadMoreButtonElement, headerElement, articleBlockElement);
    });
});

function hideLoadMoreButton(){
    document.getElementById('editorial-archive-lastpage').style.display = 'none';
}