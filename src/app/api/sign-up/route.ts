import dbConnect from "@/lib/dbconnect";
import bcrypt from "bcryptjs";
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    try{
        const {username,email,password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true,
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: 'username already exist'
            },
                {
                    status: 400,
                })
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: 'User already exist with this email'
                },{status: 400})
            }else{
                const hashedPassword = await bcrypt.hash(password, 12);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 12);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser =  new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAccepting: true,
                messages: []
            })

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            },{ status: 500})
        }


        return Response.json({
            success: true,
            message: 'User registered successfully.Please verify your email',
        },{ status: 201})

    }
    catch(e){
        console.error('Error registering user', e);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500
            }
        )
    }
}

