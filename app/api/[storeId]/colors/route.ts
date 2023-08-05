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
        const { name, value } = body
        if(!name || !value || !params.storeId) return new NextResponse("name,value and storeId is required", { status: 400 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("access denied!", { status: 400 })

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(color)

    }catch(error){
        console.log("[COLOR_POST]", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        if(!params.storeId) return new NextResponse("storeId is required", { status: 400})

        const color = await prismadb.color.findMany({
            where: {
                storeId: params.storeId 
            }
        })

        return NextResponse.json(color)

    }catch(error){
        console.log("[COLOR_GET]", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}