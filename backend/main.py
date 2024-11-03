from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os
import iris


# Initialize FastAPI app
app = FastAPI()

# Database connection settings
username = 'demo'
password = 'demo'
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
port = '1972'
namespace = 'USER'
CONNECTION_STRING = f"{hostname}:{port}/{namespace}"

# Connect to InterSystems IRIS
conn = iris.connect(CONNECTION_STRING, username, password)
cursor = conn.cursor()

# Define table with vector data type
tableName = "UserResponses"
tableDefinition = "(userID VARCHAR(100), artID INT, userInput VARCHAR(2000), userInput_vector VECTOR(DOUBLE, 384))"

# Create table if not exists
try:
    cursor.execute(f"CREATE TABLE {tableName} {tableDefinition}")
except Exception as e:
    print("Table already exists:", e)

# Initialize embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Define a Pydantic model to validate request data
class UserResponse(BaseModel):
    userID: str
    artID: int
    userInput: str

class UserResponses(BaseModel):
    responses: list[UserResponse]


#@app.post("/submit-response/")
def submit_response(data: UserResponses):
    print("Received data:", data)  # Log the data to verify structure
    for response in data.responses:
        # Generate embedding for the userInput
        embedding = model.encode(response.userInput, normalize_embeddings=True).tolist()

        # Insert data into the database with vector
        sql = f"""
            INSERT INTO {tableName} (userID, artID, userInput, userInput_vector)
            VALUES (?, ?, ?, TO_VECTOR(?))
        """
        cursor.execute(sql, (response.userID, response.artID, response.userInput, str(embedding)))
        print(f"Inserted response for userID {response.userID} and artID {response.artID}")

    #return {"status": "success", "message": "Responses submitted successfully"}

@app.post("/find-match/")
def find_match(data: UserResponses):
    # Generate embedding for the input to search
    # search_vector = model.encode(data.userInput, normalize_embeddings=True).tolist()

    # # Vector search query
    # sql = f"""
    #     SELECT userID, artID, userInput, VECTOR_DOT_PRODUCT(userInput_vector, TO_VECTOR(?)) as similarity
    #     FROM {tableName}
    #     WHERE userID != ?  -- Exclude the current user's entries
    #     ORDER BY similarity DESC
    #     LIMIT 1
    # """
    # cursor.execute(sql, [str(search_vector), data.userID])
    # result = cursor.fetchone()

    # # Check if a match was found
    # if result:
    #     return {
    #         "matchedUserID": result[0],
    #         "matchedArtID": result[1],
    #         "similarity": result[3],
    #         "message": f"Match found with user {result[0]} for artwork {result[1]}"
    #     }
    # else:
    #     raise HTTPException(status_code=404, detail="No match found")
    userId = ''
    mp = dict()
    for response in data.responses:
        userId = response.userID
        artId = response.artID
        userInput = response.userInput
        embedding = model.encode(response.userInput, normalize_embeddings=True).tolist()
        sql = f"""
            SELECT userID, artID, userInput, VECTOR_DOT_PRODUCT(userInput_vector, TO_VECTOR(?)) as similarity
            FROM {tableName}
            WHERE artID = ? and userId!=?
        """
        cursor.execute(sql, [str(embedding), response.artID, userId])
        result = cursor.fetchall()
        for row in result:
            if row[0] not in mp.keys():
                mp[row[0]]=row[3]
            else:
                mp[row[0]]+=row[3]
    submit_response(data)
    mx = 0.0
    res = ''
    for k,v in mp.items():
        print(k,v)
        if v>mx:
            res = k
            mx = v
    return {"matchedUserId": res}

    

# Close the database connection on server shutdown
@app.on_event("shutdown")
def shutdown_event():
    conn.close()
