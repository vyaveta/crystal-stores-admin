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

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(size)

    }catch(error){
        console.log("Error in SIZE POST", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        if(!params.storeId) return new NextResponse("storeId is required", { status: 400})

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId 
            }
        })

        return NextResponse.json(sizes)

    }catch(error){
        console.log("Error in size POST", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}