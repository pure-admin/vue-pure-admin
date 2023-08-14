interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parentId: number;
  name: string;
  principal: string;
  phone: string | number;
  email: string;
  sort: number;
  status: number;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
