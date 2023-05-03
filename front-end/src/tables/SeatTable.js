import React, { useEffect, useState } from "react";
import { finishTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function SeatTable() {
    const [tables, setTables] = useState([]);
    const [tableError, setTableError] = useState(null);
    const history = useHistory();

  useEffect(allTables, []);

  function allTables() {
    const abortController = new AbortController();
    setTableError(null);
    listTables(abortController.signal).then(setTables).catch(setTableError);
    return () => abortController.abort();
  }

  const finishTableHandler = async (table_id) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone.",
      )
    ) {
      await finishTable(table_id);
      // history.push("/dashboard");
      history.go(0);
    }
  };


  return (
    <div>
      <h4 >Tables</h4>
      <div>
        {tables.map((table) => {
          return (
            <div  key={table.table_id}>
              <table>
                <tbody>
                  <tr>
                    <th>Table name</th>
                    <td>{table.table_name}</td>
                  </tr>
                  <tr>
                    <th>Table Capacity</th>
                    <td>{table.capacity}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <div data-table-id-status={table.table_id}>
                        {table.reservation_id === null ? "Free" : "Occupied"}
                      </div>
                    </td>
                    <td>
                      <div>
                        {table.reservation_id !== null && (
                          <button
                          data-table-id-finish={table.table_id}
                            onClick={() => finishTableHandler(table.table_id)}>
                            Finish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
      <ErrorAlert error={tableError} />
    </div>
  );
}

export default SeatTable;