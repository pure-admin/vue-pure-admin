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

interface RoleFormItemProps {
  username: string;
  nickname: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
