export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      certificados: {
        Row: {
          empleado_id: string | null
          estado_certificacion: string | null
          fecha_certificacion: string | null
          id_certificado: string
          nombre_certificacion: string | null
          organismo_certificador: string | null
          vigencia_certificacion: string | null
        }
        Insert: {
          empleado_id?: string | null
          estado_certificacion?: string | null
          fecha_certificacion?: string | null
          id_certificado: string
          nombre_certificacion?: string | null
          organismo_certificador?: string | null
          vigencia_certificacion?: string | null
        }
        Update: {
          empleado_id?: string | null
          estado_certificacion?: string | null
          fecha_certificacion?: string | null
          id_certificado?: string
          nombre_certificacion?: string | null
          organismo_certificador?: string | null
          vigencia_certificacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificados_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleado"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado: {
        Row: {
          created_at: string | null
          edad: number | null
          id: string
          id_rol: number | null
          matricula_empleado: string
          nombre_completo: string | null
        }
        Insert: {
          created_at?: string | null
          edad?: number | null
          id: string
          id_rol?: number | null
          matricula_empleado: string
          nombre_completo?: string | null
        }
        Update: {
          created_at?: string | null
          edad?: number | null
          id?: string
          id_rol?: number | null
          matricula_empleado?: string
          nombre_completo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_id_rol_fkey"
            columns: ["id_rol"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id_serial"]
          },
        ]
      }
      incidencias: {
        Row: {
          descripcion: string | null
          empleado_id: string | null
          fecha_incidencia: string | null
          id_incidencia: number
          nombre_registrador: string | null
          tipo_incidencia: string | null
        }
        Insert: {
          descripcion?: string | null
          empleado_id?: string | null
          fecha_incidencia?: string | null
          id_incidencia?: number
          nombre_registrador?: string | null
          tipo_incidencia?: string | null
        }
        Update: {
          descripcion?: string | null
          empleado_id?: string | null
          fecha_incidencia?: string | null
          id_incidencia?: number
          nombre_registrador?: string | null
          tipo_incidencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidencias_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleado"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          datos_encriptados: string | null
          empleado_id: string | null
          id_qr: string
        }
        Insert: {
          datos_encriptados?: string | null
          empleado_id?: string | null
          id_qr: string
        }
        Update: {
          datos_encriptados?: string | null
          empleado_id?: string | null
          id_qr?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: true
            referencedRelation: "empleado"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id_rol: string
          id_serial: number
          nombre_rol: string
        }
        Insert: {
          id_rol: string
          id_serial?: number
          nombre_rol: string
        }
        Update: {
          id_rol?: string
          id_serial?: number
          nombre_rol?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
