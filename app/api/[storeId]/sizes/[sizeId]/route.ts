import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { sizeId: string }}
) {
    try{
        if(!params.sizeId) return new NextResponse("billboard id is required", { status: 400})

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId 
            }
        })

        return NextResponse.json(size)
    }catch(error){
        return new NextResponse("internal server error")
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string }}
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("UnAuthorized!", { status: 401 })

        const body = await req.json()
        const { name, value } = body

        if(!name || !value || !params.storeId || !params.sizeId) return new NextResponse("name,value and storeId is required", { status: 400 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            }
        })

        return NextResponse.json(size)

   }catch(error){
        console.log("Error from SIZE patch", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string , sizeId: string} }
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })
        if(!params.storeId) return new NextResponse("Store not found", { status: 404 })
        if(!params.sizeId) return new NextResponse("billboard not found", { status: 404 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        })
        return NextResponse.json(size)
    }catch(error){
        console.log("[DELETE_SIZE]",error)
        return new NextResponse('Server Error', {status : 500})
    }
}