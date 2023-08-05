import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("UnAuthorised",{ status: 401 })

        const body = await req.json()
        const { name, billboardId } = body
        if(!name) return new NextResponse("name is required", { status: 400 })
        if(!billboardId) return new NextResponse("billboard is required", { status: 400 })
        if(!params.storeId) return new NextResponse("storeId is required", { status: 400})

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("access denied!", { status: 400 })

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)

    }catch(error){
        console.log("Error in category POST", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        if(!params.storeId) return new NextResponse("storeId is required", { status: 400})

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId 
            },
            include: {
                billboard: true
            }
        })

        console.log(categories,'is the categories ES')

        return NextResponse.json(categories)

    }catch(error){
        console.log("Error in categories POST", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}