"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//**************************************************************** */
//Autenticacion, verificar .env para seguir pasos
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

//Verificamos contra la funcion creada en auth.ts 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales no validas.';
        default:
          return 'Ocurrio un error.';
      }
    }
    throw error;
  }
}

//**************************************************************** */
//Greather than, .gt(value, {message:''})
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Favor de seleccionar a un cliente.'
  }),
  amount: z.coerce.number().gt(0, { message: 'Favor de colocar un número mayor a $0.' }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: 'Seleccione un status válido.',
  }),
  date: z.string(), 
});

//**************************************************************** */
const CreateInvoice = FormSchema.omit({ id: true, date: true });
//Formato empleado por un hook useActionState, retorno de accion
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

//**************************************************************** */
export async function createInvoice(prevState: State, formData: FormData) {
  //SafeParse devuelve un objeto con clave success o error
  //const { customerId, amount, status } = CreateInvoice.safeParse({
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if(!validatedFields.success){
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Fallo al crear la factura.',
    };
  }
  
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: "Database Error: Fallo al crear factura.",
    };
  }

  revalidatePath("/dashboard/invoices"); //Permite purgar datos de cache para la ruta
  redirect("/dashboard/invoices");
}

//**************************************************************** */
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
//Se reciben los parametros en orden: 
//id: string          => Debido a la modificacion previa en el .bind(null, invoice.id)
//prevState: State,   => Seguiente linea tras pasar el initialState devuelto tras la validacion
//formData: FormData  => El formData tal cual que se adjunta para validar
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos faltantes, no se pudo actualizar la factura.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Fallo al actualizar factura.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

//**************************************************************** */
export async function deleteInvoice(id: string) {
    //throw new Error('Failed to Delete Invoice');

    try {
    
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return {
      message: "Database Error: Fallo al borrar la factura.",
    };
  }

  revalidatePath("/dashboard/invoices");
}
