import { eq } from "drizzle-orm";

import { db } from "../database/db";
import { masterItems } from "../models/schema/master/master.schema";
import ExcelJS from "exceljs";

export class MasterItemsService {
  /**
   * Create Master Item
   */
  static async create(data: {
    itemCode: string;
    itemName: string;
    bottlePerCase: number;
  }) {
    // Check if item code already exists
    const existingItem = await db.query.masterItems.findFirst({
      where: eq(masterItems.itemCode, data.itemCode),
    });

    if (existingItem) {
      throw new Error("Item code already exists.");
    }

    const [item] = await db
      .insert(masterItems)
      .values(data)
      .returning();

    return item;
  }

  /**
   * Get All Active Master Items
   */
  static async getAll() {
    return await db.query.masterItems.findMany({
      where: eq(masterItems.isActive, true),
      orderBy: (masterItems, { asc }) => [asc(masterItems.itemName)],
    });
  }

  /**
   * Get Master Item By Id
   */
  static async getById(id: number) {
    return await db.query.masterItems.findFirst({
      where: eq(masterItems.id, id),
    });
  }

  /**
   * Update Master Item
   */
  static async update(
    id: number,
    data: Partial<{
      itemCode: string;
      itemName: string;
      bottlePerCase: number;
    }>
  ) {
    const existingItem = await db.query.masterItems.findFirst({
      where: eq(masterItems.id, id),
    });

    if (!existingItem) {
      throw new Error("Master item not found.");
    }

    const [updatedItem] = await db
      .update(masterItems)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(masterItems.id, id))
      .returning();

    return updatedItem;
  }

  /**
   * Soft Delete Master Item
   */
  static async delete(id: number) {
    const existingItem = await db.query.masterItems.findFirst({
      where: eq(masterItems.id, id),
    });

    if (!existingItem) {
      throw new Error("Master item not found.");
    }

    const [deletedItem] = await db
      .update(masterItems)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(masterItems.id, id))
      .returning();

    return deletedItem;
  }


  static async excelUpload(file: any) {
    try {

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error("No sheets found in the uploaded file.");

      const allRows: any[] = [];
      let headers: string[] = [];
      let headerRowFound = false;

      worksheet.eachRow((row) => {
          if (!headerRowFound) {
              row.eachCell((cell, colNumber) => {
                  headers[colNumber] = cell.value ? String(cell.value) : `__EMPTY_${colNumber}`;
              });
              headerRowFound = true;
          } else {
              const rowData: any = {};
              let hasData = false;
              row.eachCell((cell, colNumber) => {
                  if (headers[colNumber] !== undefined) {
                      let val = cell.value;
                      if (val && typeof val === 'object' && 'result' in val) {
                          val = (val as any).result;
                      } else if (val && typeof val === 'object' && 'richText' in val) {
                          val = (val as any).richText.map((rt: any) => rt.text).join('');
                      }
                      rowData[headers[colNumber]] = val;
                      hasData = true;
                  }
              });
              if (hasData) {
                  allRows.push(rowData);
              }
          }
      });

      const data = allRows.splice(1) as Record<string, any>[];

      // Validate all rows first
      for (const row of data) {
        const itemCode = String(row["ItemCode"]);

        const existingItem = await db.query.masterItems.findFirst({
          where: eq(masterItems.itemCode, itemCode),
        });

        if (existingItem) {
          throw new Error(`Item code ${itemCode} already exists.`);
        }
      }

      // Insert only if all rows are valid
      await db.transaction(async (tx) => {
        for (const row of data) {
          await tx.insert(masterItems).values({
            itemCode: String(row["ItemCode"]),
            itemName: row["ItemName"],
            bottlePerCase: Number(row["BottlePerCase"]) || 0,
            isActive: true
          });
        }
      });

      return true;
    } catch (err: any) {
      throw err; // Re-throw the error
    }
  }
}