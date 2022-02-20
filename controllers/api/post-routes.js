const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_content', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [{
            model: Comment,
            attributes: ['id', 'user_id', 'post_id', 'commented_text', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
                attributes: ['username'],
        }],
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        attributes: ['id', 'post_content', 'title', 'created_at'],
        where: {
            id: req.params.id
        },
        include: [{
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'user_id', 'post_id', 'comment_text', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }
    ]
})
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post with this ID'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
    Post.create({
       title: req.body.title,
       post_content: req.body.post_content,
       user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if(!dbPostData) {
                res.status(404).json({ message: 'No post with this ID'});
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title
    },
    {
        where: {
            id: req.params.id
        }
    }
)
        .then(dbPostData => {
           if(!dbPostData) {
               res.status(404).json({ message: 'No post with this ID'});
               return;
           }
           res.json(dbPostData);
        })    
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;