(function ($) {
    
    function getPath() {
        var url = window.location.href;
        var indexOf = url.lastIndexOf('/');
        if (indexOf == url.length) {
            return null;
        }
        return url.substring(indexOf + 1);
    }

    $(document).ready(function () {
        var path = getPath();
        if (!path) {
            return;
        }
        $('.' + path).addClass('active');
    });

})(jQuery);