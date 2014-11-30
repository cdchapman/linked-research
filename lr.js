/** Linked Research
 *
 * Sarven Capadisli <info@csarven.ca> http://csarven.ca/#i
 * http://www.apache.org/licenses/LICENSE-2.0.html Apache License, Version 2.0
 * https://github.com/csarven/linked-research
 */

var LR = {
    U: {
        showToC: function() {
            var s = '';
            var section = $('h1 ~ div section[rel="dcterms:hasPart"]:not([id="acknowledgements"]');
            if (section.length > 0) {
                s += '<ol class="toc sortable"><button class="close">x</button>';
                section.each(function(i,section) {
                    var h = $(section).find('h2');
                    if (h.length > 0) {
                        s += '<li id="toc.' + section.id +'"><a href="#' + section.id + '">' + h.text() + '</a>';
                        section = $(section).find('section[rel="dcterms:hasPart"]');
                        if (section.length > 0) {
                            s += '<ol>';
                            section.each(function(j, section) {
                                var h = $(section).find('h3');
                                if (h.length > 0) {
                                    s += '<li id="toc.' + section.id +'"><a href="#' + section.id + '">' + h.text() + '</a>';
                                    section = $(section).find('section[rel="dcterms:hasPart"]');
                                    if (section.length > 0) {
                                        s += '<ol>';
                                        section.each(function(k, section) {
                                            var h = $(section).find('h4');
                                            if (h.length > 0) {
                                                s += '<li id="toc.' + section.id +'"><a href="#' + section.id + '">' + h.text() + '</a></li>';
                                            }
                                        });
                                        s += '</ol>';
                                    }
                                    s += '</li>';
                                }
                            });
                            s += '</ol>';
                        }
                        s += '</li>';
                    }
                });
                s += '</ol>';
            }

            $('body').append(s);
            LR.U.buttonClose();
        },

        sortToC: function() {
            $('.sortable').nestedSortable({
                handle: '',
                items: 'li',
                toleranceElement: '',
                placeholder: 'placeholder',
                change: LR.U.updateDocFromToC
            });
        },

        updateDocFromToC: function() {
            console.log($('.toc > li:first-child > span').text());
        },

        buttonClose: function() {
            $('button.close').on('click', function(event) { $(this).parent().remove(); });
        },

        escape: function() {
            $(document).on('keyup', function(event) {
                if(event.keyCode == 27) { // Escape Key
                    $('.toc').remove();
                }
            });
        },

        showFragment: function() {
            $(document).on({
                mouseenter: function () {
                    if($('#'+this.id+' > .fragment').length == 0){
                        $('#'+this.id).append('<span class="fragment" style="height:' + this.clientHeight + 'px; "><a href="#' + this.id + '">' + '#' + this.id + '</a></span>');
                        var fragment = $('#'+this.id+' > .fragment');
                        var fragmentClientWidth = fragment.get(0).clientWidth;
                        fragment.css({'right': '-' + (fragmentClientWidth - 2) + 'px'});
                    }

//                    $(this).attr('contenteditable', 'true');
                },
                mouseleave: function () {
                    $('#'+this.id+' > .fragment').remove();

//                    $(this).attr('contenteditable', 'false');
                }
            }, '#content *[id]');
        },

        saveToFile: function(data) {
            var blob = new Blob([data], {type:'text/html'});
            var fileName = 'index.bak.html';

            var a = document.createElement("a");
            a.download = fileName;

            if (window.webkitURL != null) {
                a.href = window.webkitURL.createObjectURL(blob);
            }
            else {
                a.href = window.URL.createObjectURL(blob);
                a.style.display = "none";
                document.body.appendChild(a);
            }

            a.click();
            document.body.removeChild(a);
        },

        autoSave: function() {
        //TODO
        },

        buildReferences: function() {
            if ($('#references ol').length == 0) {
                var r = '<ol about="[this:]">';
                $('#content a.ref').each(function(i,v) {
                    var referenceText = '';
                    var refId = (i+1);

                    if (v.title) {
                        referenceText = v.title;
//                        refId = 'ref_' + referenceText.replace(/\W+/g, '');
                    }
                    if (v.href) {
                        referenceLink = ', <a href="' + v.href + '">' + v.href + '</a>';
                    }

                    v.outerHTML = '<a class="ref" href="#' + refId + '">' + refId + '</a>';

                    r+= '<li id="' + refId + '">' + referenceText + referenceLink + '</li>\n';
    //                console.log(r);
                });
                r += '</ol>';
                $('#references').append(r);
            }
        }
    }
};

$(document).ready(function() {
//    LR.U.showToC();
//    LR.U.sortToC();
//    LR.U.escape();
    LR.U.buildReferences();

    LR.U.showFragment();
});