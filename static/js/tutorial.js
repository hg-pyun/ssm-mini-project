/**
 * Created by Lee on 2015-01-26.
 */


var tutorialBlock,
    tempSeq = 1,
    _glSourceCode = '';

/* 시작시 기본정보 요청 */
function initTutorialInfo(tid) {

    /* Block Initialize */
    urlReq.get('/tutorial/' + tid + '/info', {}, function(result) {
        if( result.error ) {
            alert(' 기본정보 요청중 에러가 발생하였습니다. ');
        }
        else {
            var data = result.data;
            var available_block = data.available_block;
            var guide_content = data.guide_content;
            var practice_content = data.practice_content;
            var tutorialTitle = data.chapterName + ' - ' + data.title;

            // OpenGL 코드는 전역으로 관리.
            _glSourceCode = data.glSolution;

            $('#tutorialModal .guideContent').html( guide_content );


            //----------------------------------------------------------
            // -- 가이드 컨텐츠 조정 시작 --
            //----------------------------------------------------------
            var $guideContent = $('.guideContent div').eq(0),
                sminHeight = 200;
            $guideContent.html( guide_content );

            var guideContentOuterHeight = $guideContent.outerHeight(true);
            sminHeight = (sminHeight > guideContentOuterHeight ) ? guideContentOuterHeight : sminHeight;

            $guideContent.attr('box_height',  guideContentOuterHeight ); // 원래 높이 기억.
            $guideContent.attr('box_shrink', true);

            /* 강제조정 */
            $guideContent.css({
                height : sminHeight + 'px',
                'overflow-y' : 'hidden'
            });


            $guideContent.hover(function(){
                    $(this).css('cursor', 'pointer');
            });

            $guideContent.click(function() {
                var current = $(this);

                if( current.attr('box_shrink') == 'true' ) {
                    /* 축소된 상태이니 늘려줌 */
                    var theight = current.attr('box_height') + 'px';
                    current.animate({ height : theight }, { 'duration' : 'slow'});
                    current.attr('box_shrink', false);
                }
                else {
                    /* 증가된 상태이니 축소 */
                    current.animate({ height : sminHeight+'px' }, { 'duration' : 'slow'});
                    current.attr('box_shrink', true);
                }
            });
            //----------------------------------------------------------
            // -- 가이드 컨텐츠 조정 끝 --
            //----------------------------------------------------------


            $('.practiceContent').html( practice_content );
            $('.tutorialTitle').html( tutorialTitle );

            /* Block Append */
            tutorialBlock = new dragDropBlockList();
            for(var i = 0; i < available_block.length; i++) {
                tutorialBlock.append( new sBlock(i+1).setBlockType( available_block[i]).initBlock() );
            }

            /* Run */
            tutorialBlock.init();
            tutorialBlock.eventRun();
        }
    })

}


/* 시작하자마자 가이드 모달창 띄움 */
$(document).ready( function() {

    // 시작하자마자 모달창 띄움.
    $('#tutorialModal').modal({
       backdrop: 'static',
       //keyboard: false,
       show: true
    });


})

/* Judge 시작 */
function procJudge( blocks_JSON, tid ) {
    if( typeof blocks_JSON !== 'object') {
        return false;
    }

    var s = JSON.stringify( blocks_JSON );
    var sParam = {
        data : s
    }

    urlReq.post('/judge/'+tid, sParam, function(result) {

        /* 에러 발생시 */
        if( result.error == true ) {
            var messageData = result.data;

            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DANGER,
                title: '아래사항을 고려해보셨나요?',
                closeByBackdrop: false,
                closeByKeyboard: false,
                message: function(dialog) {
                    var $content = $('<ol />');

                    for(var i = 0; i < messageData.length; i++) {
                        $content.append( $('<li />').html( messageData[i] ) );
                    }

                    return $content;
                },
                buttons: [
                    {
                        label: ' RETRY ',
                        cssClass: 'btn-warning',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }
                ] /* end button */
            });
        }
        /* 성공시 */
        else {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_SUCCESS,
                title : '축하합니다',
                message : ' 완료 ',
                closeByBackdrop: false,
                closeByKeyboard: false,
                buttons: [
                    {
                        label: ' OpenGL Source',
                        cssClass: 'btn-primary',
                        icon : 'glyphicon glyphicon-folder-open',
                        action: function(dialog) {
                            var sourceCode = _glSourceCode;

                            // get brush info manually.
                            var brush = new SyntaxHighlighter.brushes.Cpp();
                            var html;
                            brush.init({toolbar : false} );

                            html = brush.getHtml(sourceCode );

                            dialog.setMessage( html );
                            dialog.setSize(BootstrapDialog.SIZE_WIDE);
                        }
                    },
                    {
                        label: ' NEXT STEP ',
                        cssClass: 'btn-info',
                        action: function (dialog) {
                            dialog.close();
                        }
                    },
                ] /* end button */
            })
        }

    })
}

function procMoveBoard( tid , page ) {
    window.location.href = '/board/'+tid+'?page='+page;
    return false;
}