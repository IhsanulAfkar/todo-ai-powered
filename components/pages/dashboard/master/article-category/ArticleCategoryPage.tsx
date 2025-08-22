'use client';
import DeleteButton from '@/components/default/action/DeleteButton';
import { DataTable, SortableHeader } from '@/components/default/DataTable';
import LoadingIndicator from '@/components/default/LoadingIndicator';
import { Button } from '@/components/ui/button';
import useArticleCategory from '@/hooks/datasource/useArticleCategory';
import { useModal } from '@/hooks/useModal';
import { TArticleCategory } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, Plus } from 'lucide-react';
import { NextPage } from 'next';
import { useState } from 'react';
import CreateModal from './CreateModal';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditModal from './EditModal';
import Alert from '@/components/default/action/Alert';

const ArticleCategoryPage: NextPage = () => {
  const [selectedItem, setSelectedItem] = useState<TArticleCategory | null>(
    null,
  );
  const {
    data,
    error,
    isLoading,
    refetch,
    filter: { order, sort },
  } = useArticleCategory();
  const {
    openCreate,
    openDelete,
    openEdit,
    setOpenCreate,
    setOpenDelete,
    setOpenEdit,
  } = useModal();
  const columns: ColumnDef<TArticleCategory>[] = [
    {
      header: '#',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: 'name',
      header: () => (
        <SortableHeader
          label="Name"
          columnId="name"
          order={order}
          sort={sort}
        />
      ),
    },
    {
      id: 'action',
      header: () => <p>Action</p>,
      cell: ({ row }) => {
        const item = row.original;
        const handleEdit = () => {
          setSelectedItem(item);
          setOpenEdit(true);
        };
        const handleDelete = async () => {
          const data = await httpClient.delete(
            `/article-categories/${item.id}`,
          );
          if (data.status != 200) {
            toast.error(data.message);
            return;
          }
          toast.success('account deleted successfully');
          refetch();
        };
        return (
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  <span>Actions</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setSelectedItem(item);
                    setOpenDelete(true);
                  }}
                >
                  delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const handleDelete = async () => {
    if (!selectedItem) return;
    const data = await httpClient.delete(
      `/article-categories/${selectedItem.id}`,
    );
    if (data.status != 200) {
      toast.error(data.message);
      return;
    }
    toast.success('article deleted successfully');
    refetch();
  };
  if (error || isLoading)
    return <LoadingIndicator size={15} className="h-screen w-full" />;

  return (
    <div className="bg-foundation-100 mt-4 rounded-xl p-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="py-4 text-2xl font-bold">Article Category</p>
        <Button
          variant={'default'}
          className="cursor-pointer max-md:w-full"
          onClick={() => setOpenCreate(!openCreate)}
        >
          <div className="flex items-center gap-2">
            <Plus />
            <p>Add Category</p>
          </div>
        </Button>
      </div>
      <div className="mt-4">
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      </div>
      {openCreate && (
        <CreateModal
          isOpen={openCreate}
          setIsOpen={setOpenCreate}
          refresh={refetch}
        />
      )}
      {openEdit && selectedItem && (
        <EditModal
          isOpen={openEdit}
          setIsOpen={setOpenEdit}
          item={selectedItem}
        />
      )}
      {openDelete && selectedItem && (
        <Alert
          handler={handleDelete}
          show={openDelete}
          setShow={setOpenDelete}
        />
      )}
    </div>
  );
};

export default ArticleCategoryPage;
