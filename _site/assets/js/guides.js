(function ($) {

    function getPath() {
        var base = '/guides';
        var url = window.location.href;
        var indexOf = url.indexOf(base);
        if (indexOf == -1) {
            return null;
        }

        var subInit = indexOf + base.length + 1;

        if (url.length <= subInit) {
            return null;
        }

        var path = url.substring(indexOf + base.length + 1);
        return path.replace(/\//g, '_');
    }

    $(document).ready(function () {                
        var path = getPath();
        if (!path) {
            return;
        }
        $('.' + path).addClass('active');
    });

})(jQuery);