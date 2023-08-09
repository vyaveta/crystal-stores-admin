"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OrderColomn } from "./colomns"
import { Button } from "@/components/ui/button"
import { CopySlash, Edit, MoreHorizontal, TrashIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import AlertModal from "@/components/modals/alert-modal"

interface CellActionProps {
    data: OrderColomn
}

export const CellAction: React.FC<CellActionProps> = ({
    data,
}) => {

    const router = useRouter()
    const params = useParams()
    const [loading,setLoading] = useState(false)
    const [open,setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("id copied to clipboard")
    }

    const onSave = async () => {
        try{
            setLoading(true)
            await axios.patch(`/api/${params.storeId}/orders/${data.id}`)
            router.refresh()
            toast.success("Order updated")
        }catch(error){
            console.log("[ONSAVE_ORDER_COLLECTION]", error)
            toast.error("something went wrong")
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
        {/* <AlertModal 
            isOpen={open} 
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        /> */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" >
                    <span className="sr-only" >Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => onCopy(data.id)}
                >
                    <CopySlash className="mr-2 h-4 w-4" />
                    Copy id
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={onSave}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Move to Next Stage
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}