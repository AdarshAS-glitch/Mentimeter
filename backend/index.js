const express = require("express")
const cors = require("cors")
const zod = require("zod")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const app = express();
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()

app.post('/signup', async (req, res) => {
    const { name,email,password,role } = req.body;
    if(role==="ADMIN"){
    const user = await prisma.admin.findUnique({
        where: { email }
    });
    if (user) {
        res.json({
            message: "user already exists"
        })
    }
    else {
        const newuser = await prisma.admin.create({
            data: {
                name,email,password
            }
        });
        res.json({
            message: "signup successfull",
            
        })
    }

    }
    else{
         const user = await prisma.user.findUnique({
        where: { email }
    });
    if (user) {
       return res.json({
            message: "user already exists"
        })
    }
    else {
        const newuser = await prisma.user.create({
            data: {
                name,email,password
            }
        });
        res.json({
            message: "signup successfull"
        })
    }

    }
}

)
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    let role="USER"
        var user1 = await prisma.user.findUnique({
            where: { email }
        });
        if(!user1){
        user1 = await prisma.admin.findUnique({
            where: { email }
        });
        if(user1){
            role="ADMIN"
        }
        }
        if(!user1){
            res.json({
                message:"No user is present"
            })
        }
        

        if (user1 && user1.password === password) {
            user1.role=role;
            const decrypt={
                email:user1.email,role:user1.role
            }
            const token = jwt.sign(decrypt, "123random");
            res.json({token:token,
                message:"Signin successfull"
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    
})
app.get('/profile', async (req, res) => {
    const token = req.headers.authorization;
    const user = jwt.verify(token, "123random")
    
    const email=user.email;
    let user1 = await prisma.admin.findUnique({
        where: { email },
        include: {
            quiz: true
        }
    });
    delete user1.quiz;
    delete user1.password;
    user1.role=user.role;
    res.json(user1)



})
app.post('/quiz', async (req, res) => {
    const token=req.headers.authorization;
    const user=jwt.verify(token,"123random");
    const email=user.email;
    const questions = req.body.questions;
    const title = req.body.title;
    const admin = await prisma.admin.findUnique({
        where: { email }
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
                title: q.title,
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
         quizid: newquiz.id,
        message: "Quiz created successfully"
       
    })

})
app.get('/quiz/:quizid', async (req, res) => {
    const token = req.headers.authorization
    const username = jwt.verify(token, "123random");
    const quizid = req.params.quizid;
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizid },
        include: {
            questions: true
        }
    })
    
    delete quiz.adminid;
    for(const q of quiz.questions){
        delete q.answer
        delete q.quizid;

    }
    res.json(quiz)
})
app.post('/quiz/:quizid/submit',async (req,res)=>{
    const responses=req.body.answers;
    const token = req.headers.authorization;
    const decrypt=jwt.verify(token,"123random");
    const email=decrypt.email
    quizid=req.params.quizid;
    const totalquestions=await prisma.questions.count({
        where:{quizid:quizid}
    })
    let result = 0;
    const user = await prisma.user.findUnique({
        where: { email }
    })
    const userid = user.id
    const formattedresponse = responses.map(r => ({
        userid,
        questionid: r.questionId,
        response: r.selectedOption
    }))
     await prisma.responses.createMany({
        data: formattedresponse
    });
    const responses1 = await prisma.responses.findMany({
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
    for (const r of responses1) {
        if (r.question.quizid == quizid && r.response == r.question.answer) {
            result++;
        }
    }
    const result1 =await prisma.result.create({
        data: {
            quizid, userid, result,totalquestions
        }
    })
    result1.total=result1.totalquestions;
    result1.message="Submission evaluated";
    delete result1.id;
    delete result1.quizid;
    delete result1.userid;
    delete result1.totalquestions
res.json(result1)
    
})
app.get('/result/:quizid',async (req,res)=>{
    const token=req.headers.authorization;
    const user=jwt.verify(token,"123random")
    const quizid=req.params.quizid
    const results= await prisma.result.findMany({
        where:{quizid},include:{
            user:{
                select:{
                    name:true
                }
            }
        },orderBy:{
            result:"desc"
        }
    })
    const leaderboard={}
    for(const r of results){
        r.name=r.user.name
        r.score=r.result;
        r.totalQuestions=r.totalquestions
        delete r.user;
        delete r.result;
        delete r.totalquestions;
        delete r.id;
        delete r.quizid;
    }
    
    leaderboard.results=results;

    res.json(leaderboard)
})


app.listen(3000)