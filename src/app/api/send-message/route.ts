import UserModel, { Message } from "@/model/User";
import dbConnect from "@/lib/dbconnect";


export async function POST(request:Request){
    await dbConnect();

    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({username});

        if (!user){
            return Response.json({
                success: false,
                messages: 'User not found',
            },
                {status:404}
            );
        }

        //is user accepting the messages

        if (!user.isAcceptingMessage){
            return Response.json({
                success: false,
                messages: 'User is not accepting the messages',
            },
                {status:403}
            )
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            messages: 'Message sent successfully',
        },
            {status:401}
        );

    }catch(err){
        console.log("An unexpected error occurred", err);
        return Response.json({
            success: false,
            messages: 'not authenticated',
        },
            {status:500}
        )
    }
}