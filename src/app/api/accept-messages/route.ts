import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import {User} from "next-auth";
import dbconnect from "@/lib/dbconnect";



export async function POST(request: Request){
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated",
        },
            {status:401}
        );
    }

    const userID = user._id;
    const {acceptMessages} = await request.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(userID,
            {isAcceptingMessage: acceptMessages},
            {new: true},
            )

        if (!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user status to accept message.",
            },
                {status: 401}
            )
        }

        return Response.json({
                success: true,
                message: "Message acceptance status updated successfully.",
                updatedUser
            },
            {status: 200}
        )


    }
    catch(err){
        console.log("Failed to update user status");
        return Response.json({
            success: false,
            message:"Failed to update user status",
        },
            {status:500}
        )
    }
}


export async function GET(request: Request){
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user){
        return Response.json({
                success: false,
                message: "Not Authenticated",
            },
            {status:401}
        );
    }

    const userID = user._id;

    try{
        const foundUser = await UserModel.findById(userID);

        if (!foundUser){
            return Response.json({
                    success: false,
                    message: "User does not exist.",
                },
                {status: 404}
            )
        }

        return Response.json({
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {status: 200}
        )

    }catch(err){
        console.log("Failed to update user status");
        return Response.json({
                success: false,
                message:"Error in getting in message acceptance status",
            },
            {status:500}
        )
    }
}