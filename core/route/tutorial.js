/**
 * Created by Lee on 2015-01-23.
 */

var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    u = require('../Util');

var tutorialController = require('../controller/tutorialCont');

/* Middleware */
router.use( function(req, res, next) {
    var sess = req.session;

    // console.log( req.originalUrl );
    u.assert( sess.member, '사용 권한이 없습니다', 403, true);

    next();

});
router.use('/:tid([0-9]+)', function(req, res, next) {
    u.assert( req.params.tid > 0 , '잘못된 접근', 403);
    req.tid = parseInt( req.params.tid );
    next();
});


/* Routing */
router.get('/:tid([0-9]+)', tutorialController.procTutorial ); // 단계별 튜토리얼 진행
router.get('/:tid([0-9]+)/info', tutorialController.getTutorialInfo); // 단계별 튜토리얼 정보 가져옴.
router.get('/progressInfo', tutorialController.getTutorialChapterProgressInfo); // 챕터별 튜토리얼 진행상황 가져옴.





/* EXPORT */
module.exports = router;