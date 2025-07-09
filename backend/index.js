const express = require("express")
const cors = require("cors")
const zod = require("zod")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const app = express();
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()

app.post('/adminsignup', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.admin.findUnique({
        where: { username }
    });
    if (user) {
        res.json({
            message: "user already exists"
        })
    }
    else {
        const newuser = await prisma.admin.create({
            data: {
                username, password
            }
        });
        res.json({
            message: "signup successfull",
            user: newuser
        })
    }


}

)
app.post('/adminsignin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.admin.findUnique({
            where: { username }
        });

        if (user && user.password === password) {
            const token = jwt.sign(user.username, "123random");
            res.json(token);
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})
app.post('/admin/create', async (req, res) => {
    const token = req.headers.token
    const questions = req.body
    const title = questions[0].title
    const username = jwt.verify(token, "123random")
    const admin = await prisma.admin.findUnique({
        where: { username }
    })

    if (!admin) {
        return res.status(403).json({ message: "Unauthorized admin" });
    }
    const newquiz = await prisma.quiz.create({
        data: {
            title,
            admin: { connect: { id: admin.id } }
        }
    })
    for (const q of questions) {
        await prisma.questions.create({
            data: {
                question: q.question,
                option1: q.option1,
                option2: q.option2,
                option3: q.option3,
                option4: q.option4,
                answer: q.answer,
                quiz: { connect: { id: newquiz.id } },
            },
        });
    }
    res.json({
        message: "quiz and questions created",
        quiz: newquiz
    })
})
app.get('/adminquiz', async (req, res) => {
    const token = req.headers.token;
    const username = jwt.verify(token, "123random")
    const admin = await prisma.admin.findUnique({
        where: { username },
        include: {
            quiz: true
        }
    });
    res.json(admin.quiz)



})
app.post('/usersignup', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { username }
    });
    if (user) {
        res.json({
            message: "user already exists"
        })
    }
    else {
        const newuser = await prisma.user.create({
            data: {
                username, password
            }
        });
        res.json({
            message: "signup successfull",
            user: newuser
        })
    }


}
)
app.post('/usersignin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (user && user.password === password) {
            const token = jwt.sign(user.username, "123random");
            res.json(token);
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})

app.get('/userquiz', async (req, res) => {
    const token = req.headers.token
    const username = jwt.verify(token, "123random");
    const quizes = await prisma.quiz.findMany()
    res.json({ username, quizes })
})
app.get('/userquiz/:id', async (req, res) => {
    const token = req.headers.token
    const username = jwt.verify(token, "123random");
    const quizid = parseInt(req.params.id);
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizid },
        include: {
            questions: true
        }
    })
    res.json(quiz)
})
app.post('/userquiz/:id', async (req, res) => {
    const responses = req.body
    const token = req.headers.token
    const username = jwt.verify(token, "123random");
    const user = await prisma.user.findUnique({
        where: { username }
    })
    const userid = user.id
    const formattedresponse = responses.map(r => ({
        userid,
        questionid: r.questionid,
        response: r.response
    }))
    await prisma.responses.createMany({
        data: formattedresponse
    }

    )
    res.json({
        message: "Successfull"
    })
}
)
app.get('/userquiz/result/:id', async (req, res) => {
    const token = req.headers.token;
    let result = 0;
    const username = jwt.verify(token, "123random");
    const user = await prisma.user.findUnique({
        where: { username }
    })
    const userid = user.id;
    const quizid = parseInt(req.params.id)
    const responses = await prisma.responses.findMany({
        where: {
            userid
        },
        include: {
            question: {
                select: {
                    quizid: true,
                    answer: true
                }
            }
        }
    });
    for (const r of responses) {
        if (r.question.quizid == quizid && r.response == r.question.answer) {
            result++;
        }
    }
    await prisma.result.create({
        data: {
            quizid, userid, result
        }
    })
    res.json({
        Score: result
    })
})
app.get('/leaderboard/:id', async (req, res) => {
    const quizid = parseInt(req.params.id);
    const results = await prisma.result.findMany({
        where: { quizid }, include: {
            user: {
                select: {
                    username: true
                }
            }

        }, orderBy: {
            result: "desc"
        }
    })
    res.json(results.map(r => ({
        username: r.user.username,
        result: r.result
    })))
})

app.listen(3000)