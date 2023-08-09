import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { categoryId: string }}
) {
    try{
        if(!params.categoryId) return new NextResponse("category id is required", { status: 400})

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId  
            },
            include: {
                billboard: true
            } 
        })

        return NextResponse.json(category)
    }catch(error){
        return new NextResponse("internal server error")
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string }}
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("UnAuthorized!", { status: 401 })

        const body = await req.json()
        const { name, billboardId } = body

        if(!name) return new NextResponse("Label is required!",{ status: 400})
        if(!billboardId) return new NextResponse("imageUrl is required", { status: 400})
        if(!params.categoryId) return new NextResponse("category id is required", { status: 400}) 

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            }
        })

        return NextResponse.json(category)

   }catch(error){
        console.log("Error from category patch", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string , categoryId: string} }
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })
        if(!params.storeId) return new NextResponse("Store not found", { status: 404 })
        if(!params.categoryId) return new NextResponse("category not found", { status: 404 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })
        return NextResponse.json(category)
    }catch(error){
        console.log("[DELETE_CATEGORY]",error)
        return new NextResponse('Server Error', {status : 500})
    }
}